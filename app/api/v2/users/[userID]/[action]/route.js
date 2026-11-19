
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "@/app/api/utils/oldAuth.js";
import { auth } from "@/app/api/utils/auth.ts";
import { headers } from "next/headers";



export async function POST(req, { params }) {

    const args = await req.json()
    const session = await auth.api.getSession({ headers: await headers() });
    const authCheck = new Auth(session, args)

    if (authCheck.failed) return authCheck.verify(authCheck.response)

    const { userID, action } = await params

    if (userID) {
        switch (action) {
            case "roles":
                authCheck
                    .requireRoles(["admin"])
                    .requireParams(["roles"])
                if (authCheck.failed) return authCheck.verify(authCheck.response)
                return authCheck.verify(await handlePostRoles(userID, args))
            case "vouchers":
                authCheck
                    .requireRoles(["board"])
                    .requireParams(["amount"])
                if (authCheck.failed) return authCheck.verify(authCheck.response)
                return authCheck.verify(await handleRegisterVouchers(userID, args.amount))
        }
    }
}

export async function GET(req, { params }) {
    const { userID, action } = await params

    const session = await auth.api.getSession({ headers: await headers() })
    const authCheck = new Auth(session)
        .requireRoles([])
        .requireOwnership(userID)

    if (authCheck.failed) return authCheck.verify(authCheck.response)


    if (userID) {
        let res;
        switch (action) {
            case "roles":
                res = handleGetRoles(userID)
                break
            case "workLogs":
                res = handleGetWorkLogs(userID)
                break
            case "recruitInfo":
                res = handleGetRecruitInfo(userID)
                break
            default:
                res = handleGetUser(userID)
                break
        }
        return authCheck.verify(await res)
    }
}

function handleGetUser(userID) {
    return NextResponse.json({}, { status: 200 })
}

async function handlePostRoles(userID, args) {

    const roles = args.roles;

    await prisma.UserRole.deleteMany({
        where: {
            userId: userID
        }
    })

    const roleList = await prisma.role.findMany({ select: { id: true, name: true } })
    const roleMap = {}
    for (let role of roleList) roleMap[role.name] = role.id

    for (let role of roles) {
        await prisma.UserRole.create({
            data: {
                userId: userID,
                roleId: roleMap[role]
            }
        })
    }

    return NextResponse.json({}, { status: 200 })
}

async function handleRegisterVouchers(userId, amount) {
    const loggedDate = new Date();

    let success
    try {
        success = await prisma.$transaction(async (transaction) => {
            const voucherExpirationDate = (await transaction.Semester.findFirst({
                select: {
                    voucherExpirationDate: true
                },
                orderBy: {
                    id: 'desc'
                }
            })).voucherExpirationDate

            const voucherData = [];
            for (let i = 0; i < Math.floor(amount); i++) {
                voucherData.push({
                    userId: userId,
                    loggedDate: loggedDate,
                    expirationDate: voucherExpirationDate
                })
            }

            await transaction.Voucher.createMany({
                data: voucherData
            })
            return true
        })
    } catch (error) {
        return NextResponse.json({ userId: userId }, { status: 500 })
    }

    if (success) {
        return NextResponse.json({}, { status: 200 })
    }
}

async function handleGetWorkLogs(userID) {
    const workLogs = await prisma.workLog.findMany({
        where: {
            loggedFor: userID
        },
        select: {
            duration: true,
            workedAt: true,
            description: true,
            LoggedByUser: {
                select: {
                    name: true
                }
            },
        }
    })
    return NextResponse.json(
        { workLogs: workLogs },
        { status: 200 }
    )
}

async function handleGetRoles(userID) {
    const userRoleIds = await prisma.user.findFirst({
        where: {
            id: userID
        },
        select: {
            roles: {
                select: {
                    roleId: true
                }
            }
        }
    })

    const rolesList = await prisma.role.findMany({
        select: {
            name: true,
            id: true
        }
    })

    const roles = {}

    for (let role of rolesList) {
        roles[role.id] = role.name
    }


    const userRoles = userRoleIds.roles.map(e => roles[e.roleId])

    return NextResponse.json(
        { userRoles: userRoles },
        { status: 200 }
    )



}

async function handleGetRecruitInfo(userID) {
    const numRecruits = (await prisma.User.findFirst({
        where: {
            id: userID
        },
        select: {
            _count: {
                include: {
                    recruitedUsers: true
                }
            }
        }
    }))._count.recruitedUsers

    const recruitLogs = await prisma.User.findFirst({
        where: {
            id: userID
        },
        select: {
            recruitedUsers: {
                select: {
                    LoggedForUser: {
                        select: {
                            duration: true
                        }
                    }
                }
            }
        }
    })

    const recruitHours = recruitLogs.recruitedUsers.flatMap(user => user.LoggedForUser).reduce((sum, log) => sum + log.duration, 0)

    return NextResponse.json({
        numRecruits: numRecruits,
        recruitHours: recruitHours
    })
}

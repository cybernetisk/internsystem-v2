import prisma from "@/prisma/prismaClient"

async function main() {

  await prisma.semester.upsert({
    where: { id: 27 },
    update: {},
    create: {
        id: 27,
        semester: 'Spring',
        year: 2026,
        semesterTitle: "Spring 2026",
        semesterStart: new Date("2026-01-01"), 
        semesterEnd: new Date("2026-07-31"),
        voucherExpirationDate: new Date("2026-09-01")
    }   
  })
  
  const roles = ["admin", "board"]
  for (const role of roles) {
    await prisma.role.upsert({
      where: {name: role},
      update: {},
      create: {
        name: role,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      }
    })

  }

  const workgroups = ["IT", "Economy", "Bar", "Cafè"]
  for (const group of workgroups) {
    await prisma.workGroup.upsert({
      where: {id: group},
      update: {},
      create: {
        id: group,
        name: group,
        leaderTitle: group + " sjef",
        description: group + " workgroup"
      }
    })

  }

  
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

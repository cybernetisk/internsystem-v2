import {useRouter} from "next/navigation";
import {PageBuilderSkeleton} from "../components/sanity/PageBuilder";
import {authClient} from "@/app/api/utils/auth-client.ts";

export default function authWrapper(WrappedComponent, requiredRole = "", redirect = "/unauthorized") {
    return function AuthenticatedComponent(props) {

        const router = useRouter();
        const session = authClient.useSession();

        if (session.isPending) {
            return <PageBuilderSkeleton/>
        } else {
            const userRoles = session.data.user.roles;
            const missingRole = !userRoles.includes(requiredRole)

            if (missingRole && !(requiredRole === "")) {
                router.push(redirect)
            }
        }


        // show content
        return <WrappedComponent {...props} />;
    };
}

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageBuilderSkeleton } from "../components/sanity/PageBuilder";

export default function authWrapper(WrappedComponent, requiredRole="", redirect="/pages/main/unauthorized") {
  return function AuthenticatedComponent(props) {
    
    const router = useRouter();
    const { data, status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push(redirect);
      }
    });
    
    if (status == "loading") {
      return <PageBuilderSkeleton/>
    }
    else if (status == "authenticated" && requiredRole != "") {
      
      const userRoles = data.user.roles.map((e) => e.name)
      const missingRole = !userRoles.includes(requiredRole)
      
      if (missingRole) {
        router.push(redirect)
      } 
    }
    

    // show content
    return <WrappedComponent {...props} />;
  };
}
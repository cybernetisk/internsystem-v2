
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function authWrapper(WrappedComponent, requiredRole="", redirect="/pages/main/home") {
  return function AuthenticatedComponent(props) {
    
    const router = useRouter();
    const { data, status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push(redirect);
      }
    });
    
    // check if user has correct role
    useEffect(() => {
      if (requiredRole == "") {
        return
      }
      
      if (status == "authenticated") {
        const userRoles = data.user.roles.map((e) => e.name)
        const missingRole = !userRoles.includes(requiredRole)
        
        if (missingRole) {
          router.push(redirect)
        } 
      }
    }, [status, data, router])
    
    // show placeholder if content is not loaded
    if (status == "loading") {
      return <div>Loading...</div>
    }

    // show content
    return <WrappedComponent {...props} />;
  };
}
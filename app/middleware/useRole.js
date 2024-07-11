
// import { useSession } from 'next-auth/client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function useRole(role) {

  const router = useRouter()
  
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push("home");
    },
  });
  
  // if (session.status == "loading") return false
  
  return session.status != "unauthenticated" && session.data.user.roles.includes(role)
}

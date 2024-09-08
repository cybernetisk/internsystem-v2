
export function getUserInitials(user: {
  firstName: string;
  lastName: string;
}) {
  
  let firstName = user && user.firstName ? user.firstName : "";
  let lastName = user && user.lastName ? user.lastName : "";
  let fullName = `${firstName} ${lastName}`;
  
  let nameBits = fullName.trim().split(" ");
  let firstFirstName = nameBits[0];
  
  let initials = nameBits
  .slice(1)
  .map((part) => {
    return part
      .split("-") // Handle names with dashes
      .map((subPart) => (subPart.length !== 0 ? subPart[0].toUpperCase() : ""))
      .join("");
  })
  .join("");
  
  return `${firstFirstName} ${initials}`;
}

export function getUserInitials(user: {
  name: string;
}) {
  

  let nameBits = user.name.trim().split(" ");
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

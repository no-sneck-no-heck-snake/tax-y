export function getCategoryIcon(value) {
  switch (value) {
    case "Ausbildung":
      return "school";
    case "Kinder":
      return "child";
    case "3a":
      return "poll";
    default:
      return "file";
  }
}

export function getCategoryColor(value) {
  switch (value) {
    case "Ausbildung":
      return "#0088FE";
    case "Kinder":
      return "#00C49F";
    case "3a":
      return "#FF8042";
    default:
      return "#00C49F";
  }
}

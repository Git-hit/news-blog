export default function flattenFields(fields) {
  const result = {};
  for (const key in fields) {
    result[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
  }
  return result;
};
export const getRouteForRole = (role?: string | null) => {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "seller") {
    return "/seller";
  }

  return "/";
};

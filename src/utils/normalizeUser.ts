
export function normalizeDashboardUser(user: IApiUser): IDashboardUser {
  return {
    id: user._id, 
    email: user.email,
    username: user.username,
    role: user.role,
    multiLang: user.multiLang,
    menuId: user.menuId,
    menuLogo: user.menuLogo,
    isOnboarded: user.isOnboarded,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
    description: user.description,
    menuName: user.menuName,
    qrcode: user.qrcode,
    theme: user.theme,
    plan: user.plan,
    planExpiresAt: user.planExpiresAt,
    loyalty: {
      isActive: user.loyalty?.isActive ?? false,
      pointRate: user.loyalty?.pointRate ?? 0,
      rewards: user.loyalty?.rewards?.map((r) => ({
        _id: r._id,
        title: r.title,
        requiredPoints: r.requiredPoints,
        type: r.type,
        value: r.value,
        isActive:r.isActive,
        expiresAt:r.expiresAt
      })) ?? [],
    },
  };
}

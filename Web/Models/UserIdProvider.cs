using System;
using System.Security.Claims;

namespace Web.Models
{
    public static class UserIdProvider
    {
        public static int GetUserId(ClaimsPrincipal user)
        {
            try
            {
                return Convert.ToInt32(user.Identity.Name);
            }
            catch (Exception)
            {
                return 0;
            }
        }
    }
}
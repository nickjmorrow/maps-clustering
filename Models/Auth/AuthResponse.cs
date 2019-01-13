using WebApplication.Models;

namespace WebApplication.Models
{
    public class AuthResponse : User
    {
        public string ErrorText { get; set; }
    }
}
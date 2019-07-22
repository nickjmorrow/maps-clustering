using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            this._authService = authService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] AuthInfo authInfo)
        {        
            return Ok(await this._authService.Authenticate(authInfo));
        }

        [HttpPost("[action]")]
        public IActionResult Register([FromBody] User user)
        {
            return Ok(this._authService.Register(user));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AuthenticateWithGoogle([FromBody] User user)
        {
            
            return Ok(await this._authService.AuthenticateGoogle(user));
        }
    }
}
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApplication.Helpers;
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
        public IActionResult Login([FromBody] AuthInfo authInfo)
        {        
            var user = this._authService.Authenticate(authInfo);

            if (user == null)
            {
                return BadRequest(new {message = "User could not be found with that email and password. "});
            }

            return Ok(user);
        }

        [HttpPost("[action]")]
        public IActionResult Register([FromBody] User user)
        {
            try
            {
                return Ok(this._authService.Register(user));
            }
            catch (Exception e)
            {
                return BadRequest(new { message =
                    $"User could not be registered: Exception: {e}"
                });
            };
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AuthenticateWithGoogle([FromBody] User user)
        {
            var payload = GoogleJsonWebSignature
                .ValidateAsync(user.Token, new GoogleJsonWebSignature.ValidationSettings()).Result;
            return Ok(await this._authService.AuthenticateGoogle(payload));
        }
    }
}
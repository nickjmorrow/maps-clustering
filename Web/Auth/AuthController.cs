using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApplication.Helpers;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : Controller
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            this._authService = authService;
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] AuthInfo authInfo)
        {        
            return Ok(await this._authService.Authenticate(authInfo));
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public IActionResult Register([FromBody] User user)
        {
            return Ok(this._authService.Register(user));
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> AuthenticateWithGoogle([FromBody] User user)
        {
            
            return Ok(await this._authService.AuthenticateGoogle(user));
        }
    }
}
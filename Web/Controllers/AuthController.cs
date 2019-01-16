using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly UserService _userService;

        public AuthController(UserService userService)
        {
            this._userService = userService;
        }

        [HttpPost("[action]")]
        public IActionResult Login([FromBody] AuthInfo authInfo)
        {        
            var user = this._userService.Authenticate(authInfo);

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
                return Ok(this._userService.Register(user));
            }
            catch (Exception e)
            {
                return BadRequest(new { message =
                    $"User could not be registered: Exception: {e}"
                });
            };
        }
    }
}
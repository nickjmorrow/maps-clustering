using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Services;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public partial class TestController : Controller
    {
        [HttpGet("[action]")]
        public IActionResult GetList()
        {
            return Ok(new List<string>() { "Hey", "there", "superstar" });
        }
    }
}
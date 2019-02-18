using System;
using System.Collections.Generic;
using System.Linq;
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
        private DatabaseContext _context;

        public TestController(DatabaseContext context)
        {
            this._context = context;
        }

        [HttpGet("[action]")]
        public IActionResult GetList()
        {
            return Ok(new List<string>() { "Hey", "there", "superstar" });
        }

        [HttpGet("[action]")]
        public IEnumerable<string> GetPersistedValues()
        {
            return this._context.TestValues.Select(tv => tv.TestValueId).ToList();
        }

        [HttpGet("[action]")]
        public int GetVersion()
        {
            return 3;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Models;
using Web.Services;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class TestController : Controller
    {
        private DatabaseContext _context;

        public TestController(DatabaseContext context)
        {
            this._context = context;
        }

        [HttpGet("[action]")]
        public int GetVersion()
        {
            return 5;
        }
    }
}
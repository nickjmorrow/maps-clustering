using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class PointController : Controller
    {
        private readonly PointService _pointService;
        private int _userId => Int32.Parse(this.User.Identity.Name);

        public PointController(PointService pointService)
        {
            this._pointService = pointService;
        }

        [HttpGet("[action]")]
        public IActionResult GetPoints()
        {
            return Ok(this._pointService.GetPoints(this._userId));
        }
    }
}
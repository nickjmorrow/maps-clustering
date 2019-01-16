using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Services;
using WebApplication.Models.DTOs;

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
        public async Task<IActionResult> GetPoints()
        {
            return Ok(await this._pointService.GetPointsAsync(this._userId));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPoints(IEnumerable<Point> points)
        {
            return Ok(await this._pointService.AddPointsAsync(this._userId, points));
        }
        
        
    }
}
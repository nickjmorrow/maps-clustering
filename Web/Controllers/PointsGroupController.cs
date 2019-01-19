using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Web.Services;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class PointsGroupController : Controller
    {
        private readonly PointsGroupService _pointsGroupService;
        private int _userId => Int32.Parse(this.User.Identity.Name);

        public PointsGroupController(PointsGroupService pointsGroupService)
        {
            this._pointsGroupService = pointsGroupService;
        }

        [HttpGet("[action]")]
        public IActionResult GetPointsGroups()
        {
            return Ok(this._pointsGroupService.GetPointsGroups(this._userId));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddPointsGroup([FromBody] PointsGroupInput pointsGroupInput)
        {
            return Ok(await this._pointsGroupService.AddPointsGroupAsync(this._userId, pointsGroupInput));
        }

        [HttpDelete("[action]/{pointsGroupId}")]
        public async Task<IActionResult> DeletePointsGroup(int pointsGroupId)
        {
            return Ok(await this._pointsGroupService.DeletePointsGroupAsync(pointsGroupId));
        }
    }
}
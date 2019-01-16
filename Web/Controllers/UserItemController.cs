using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warlock.Services;

namespace WebApplication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserItemController : Controller
    {
        private readonly UserItemService _userItemService;
        private int _userId => Int32.Parse(this.User.Identity.Name);

        public UserItemController(UserItemService userItemService)
        {
            this._userItemService = userItemService;
        }

        [HttpGet("[action]")]
        public IActionResult GetUserItems()
        {
            return Ok(this._userItemService.GetUserItems(this._userId));
        }

        [HttpGet("[action]")]
        public IActionResult GetUserFavoriteItems()
        {
            return Ok(this._userItemService.GetUserFavoriteItems(this._userId));
        }

        [HttpPost("[action]")]
        public IActionResult AddUserItem([FromQuery(Name = "itemId")] int itemId)
        {
            return Ok(this._userItemService.AddUserItem(this._userId, itemId));
        }

        [HttpDelete("[action]")]
        public IActionResult RemoveUserItem([FromQuery(Name = "itemId")] int itemId)
        {
            return Ok(this._userItemService.RemoveUserItem(this._userId, itemId));
        }

        [HttpPost("[action]")]
        public IActionResult ToggleFavoriteItem([FromQuery(Name = "itemId")] int itemId)
        {
            return Ok(this._userItemService.ToggleFavoriteItem(this._userId, itemId));
        }
        
        
    }
}
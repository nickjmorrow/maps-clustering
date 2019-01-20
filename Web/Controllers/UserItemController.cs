using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Warlock.Services;
using Web.Services;

namespace WebApplication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserItemController : Controller
    {
        private readonly ItemService _itemService;
        private int _userId => Int32.Parse(this.User.Identity.Name);

        public UserItemController(ItemService itemService)
        {
            this._itemService = itemService;
        }

        [HttpGet("[action]")]
        public IActionResult GetItems()
        {
            return Ok(this._itemService.GetItems(this._userId));
        }
    }
}
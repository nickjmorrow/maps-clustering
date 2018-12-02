using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class MagicItemController : Controller
    {
        private MagicItemService _magicItemService;

        public MagicItemController(MagicItemService magicItemService)
        {
            this._magicItemService = magicItemService;
        }

        // TODO: Add other async methods
        // TODO: Add EF tests
        // TODO: Play around more with dependency injection, ie don't just register interfaces
        // TODO: Use a code generator or something to copy all this
        // TODO: consider implementing unit of work pattern
        [HttpPost("[action]")]
        public async Task<IActionResult> Add([FromBody] MagicItem magicItem)
        {
            if (magicItem == null)
            {
                return BadRequest();
            }
            return Ok(await this._magicItemService.AddAsync(magicItem));
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> Get()
        {
            return Ok(await this._magicItemService.GetAsync());
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> Update([FromBody] MagicItem magicItem)
        {
            if (magicItem == null)
            {
                return BadRequest();
            }

            return Ok(await this._magicItemService.UpdateAsync(magicItem));
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            return Ok(await this._magicItemService.DeleteAsync(id));
        }
    }
}
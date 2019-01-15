using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Models;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class SpellController : Controller
    {
        private SpellService _spellService;
        
        public SpellController(SpellService spellService)
        {
            this._spellService = spellService;
        }
        
        [HttpGet("[action]")]
        public async Task<IActionResult> Get()
        {
            return Ok(await this._spellService.GetAsync());
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Add([FromBody] Spell spell)
        {
            return Ok(await this._spellService.AddAsync(spell));
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> Update([FromBody] Spell spell)
        {
            return Ok(await this._spellService.UpdateAsync(spell));
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await this._spellService.DeleteAsync(id));
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

namespace WebApplication.Services
{
    public class SpellService
    {
        private DatabaseContext _context;

        public SpellService(DatabaseContext context)
        {
            this._context = context;
        }

        public async Task<IEnumerable<Spell>> GetAsync()
        {
            using (var context = this._context)
            {
                return await context.Spells.ToListAsync();
            }
        }

        public async Task<Spell> AddAsync(Spell spell)
        {
            using (var context = this._context)
            {
                await context.Spells.AddRangeAsync(spell);
                await context.SaveChangesAsync();
                return spell;
            }
        }

        public async Task<Spell> DeleteAsync(int spellId)
        {
            using (var context = this._context)
            {
                context.WizardSpells.RemoveRange(context.WizardSpells.Where(ws => ws.SpellId == spellId));
                var spell = await context.Spells.FindAsync(spellId);
                context.Spells.Remove(spell);
                await context.SaveChangesAsync();
                return spell;
            }
        }

        public async Task<Spell> UpdateAsync(Spell spell)
        {
            using (var context = this._context)
            {
                context.Spells.Update(spell);
                await context.SaveChangesAsync();
                return spell;
            }
        }

        public async Task<WizardSpell> AddWizardSpellAsync(WizardSpell wizardSpell)
        {
            using (var context = this._context)
            {
                await context.WizardSpells.AddAsync(wizardSpell);
                await context.SaveChangesAsync();
                return wizardSpell;
            }
        }

        public async Task<WizardSpell> DeleteWizardSpellAsync(int wizardId, int spellId)
        {
            using (var context = this._context)
            {
                var wizardSpell = await context.WizardSpells.FindAsync(new {WizardId = wizardId, SpellId = spellId});
                context.WizardSpells.Remove(wizardSpell);
                return wizardSpell;
            }
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication.Models;

namespace WebApplication.Services
{
    public class MagicItemService
    {
        private DatabaseContext _context;

        public MagicItemService(DatabaseContext context)
        {
            this._context = context;
        }
        
        public async Task<IEnumerable<MagicItem>> GetAsync()
        {
            using (var context = this._context)
            {
                return await context.MagicItems.ToListAsync();
            }
        }

        public async Task<MagicItem> AddAsync(MagicItem magicItem)
        {
            using (var context = this._context)
            {
                context.MagicItems.Add(magicItem);
                await context.SaveChangesAsync();
                return magicItem;
            }
        }

        public async Task<MagicItem> UpdateAsync(MagicItem magicItem)
        {
            // TODO: consider if this is the best way
            if (magicItem.WizardId == 0)
            {
                magicItem.WizardId = null;
            }
            using (var context = this._context)
            {
                context.MagicItems.Update(magicItem);
                await context.SaveChangesAsync();
                return magicItem;
            }
        }

        public async Task<MagicItem> DeleteAsync(int magicItemId)
        {
            using (var context = this._context)
            {
                var magicItem = await context.MagicItems.FindAsync(magicItemId);
                context.MagicItems.Remove(magicItem);
                await context.SaveChangesAsync();
                return magicItem;
            }
        }
    }
}
using System;
using System.Threading.Tasks;
using WebApplication;
using WebApplication.Models;

namespace Web.Services
{
    public class ItemService
    {
        private DatabaseContext _context;

        public ItemService(DatabaseContext context)
        {
            this._context = context;
        }

        public async Task<int> AddItemAsync(int itemTypeId)
        {
            var item = new Item()
            {
                ItemTypeId = itemTypeId,
                DateCreated = DateTime.Now,
                DateDeleted = null
            };
            await this._context.Items.AddAsync(item);
            await this._context.SaveChangesAsync();
            return item.ItemId;
        }
    }
}
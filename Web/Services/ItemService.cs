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
            using (var context = this._context)
            {
                var item = new Item()
                {
                    ItemTypeId = itemTypeId
                };
                await context.Items.AddAsync(item);
                await context.SaveChangesAsync();
                return item.ItemId;
            }
        }
    }
}
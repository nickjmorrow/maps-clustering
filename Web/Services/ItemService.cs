using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication;
using WebApplication.Enums;
using WebApplication.Models;

namespace Web.Services
{
    public class ItemService
    {
        private DatabaseContext _context;
        private ItemFilterer _itemFilterer;

        public ItemService(DatabaseContext context, ItemFilterer itemFilterer)
        {
            this._context = context;
            this._itemFilterer = itemFilterer;
        }

        public async Task<int> AddItemAsync(int itemTypeId, 
            ItemPermissionType itemPermissionType = ItemPermissionType.Private)
        {
            var item = new Item()
            {
                ItemTypeId = itemTypeId,
                DateCreated = DateTime.Now,
                DateDeleted = null,
                ItemPermissionTypeId = itemPermissionType
            };
            await this._context.Items.AddAsync(item);
            await this._context.SaveChangesAsync();
            return item.ItemId;
        }

        public IEnumerable<Item> GetItems(int? userId)
        {
            return this._itemFilterer.GetValidItems<Item>(userId, this._context.Items).Select(i => new Item()
            {
                ItemId = i.ItemId,
                ItemPermissionTypeId = i.ItemPermissionTypeId,
                DateCreated = i.DateCreated
            });
        }
    }
}
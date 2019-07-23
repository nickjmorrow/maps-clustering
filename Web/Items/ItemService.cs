using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication;
using WebApplication.Enums;
using WebApplication.Models;
using ItemType = WebApplication.Enums.ItemType;

namespace Web.Services
{
    public class ItemService
    {
        private readonly DatabaseContext _context;
        private readonly ItemFilterer _itemFilterer;

        public ItemService(DatabaseContext context, ItemFilterer itemFilterer)
        {
            this._context = context;
            this._itemFilterer = itemFilterer;
        }

        public async Task<int> AddItemAsync(ItemType itemType, 
            ItemPermissionType itemPermissionType)
        {
            var item = new Item
            {
                ItemTypeId = itemType,
                DateCreated = DateTime.Now,
                DateDeleted = null,
                ItemPermissionTypeId = itemPermissionType
            };
            await this._context.Items.AddAsync(item);
            await this._context.SaveChangesAsync();
            return item.ItemId;
        }

        public IReadOnlyList<Item> GetItems(int? userId) =>
            this._itemFilterer.GetValidItems(userId, this._context.Items.ToList());
        
    }
}
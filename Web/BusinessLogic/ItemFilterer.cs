using System.Collections.Generic;
using System.Linq;
using Web.Models;
using WebApplication;
using WebApplication.Enums;
using WebApplication.Models;

namespace Web.Services
{
    public class ItemFilterer
    {
        private readonly DatabaseContext _context;

        public ItemFilterer(DatabaseContext context)
        {
            this._context = context;
        }

        public IReadOnlyList<T> GetValidItems<T>(int? userId, IReadOnlyList<T> items)
        where T : IItemBound
        { 
            var userPermissionedItems = this.GetPermissionedItems(userId, items);
            var validItems = this.GetNotDeletedItems(userPermissionedItems);
            
            return validItems;
        }

        private IReadOnlyList<T> GetPermissionedItems<T>(int? userId, IReadOnlyList<T> items)
            where T : IItemBound
        {
            var publicItems = this._context.Items
                .Where(i => i.ItemPermissionTypeId == ItemPermissionType.Public);
            
            var userItems = userId.HasValue
                ? this._context.UserItems
                    .Where(ui => ui.UserId == userId)
                    .ToList()
                : new List<UserItem>();


            return items
                .Where(i => userItems.Any(ui => ui.ItemId == i.ItemId)
                            || publicItems.Any(pi => pi.ItemId == i.ItemId))
                .ToList();
        }

        private IReadOnlyList<T> GetNotDeletedItems<T>(IReadOnlyList<T> items)
            where T : IItemBound, IDeletable
        {
            var notDeletedItems = items.Where(i => !i.DateDeleted.HasValue);
            return items
                .Where(i => notDeletedItems.Any(ndi => ndi.ItemId == i.ItemId))
                .ToList();
        }
    }
}
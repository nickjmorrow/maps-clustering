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
        private DatabaseContext _context;

        public ItemFilterer(DatabaseContext context)
        {
            this._context = context;
        }

        public IEnumerable<T> GetValidItems<T>(int? userId, IEnumerable<T> items)
        where T : IItemBound
        {
            // TODO: can this be a delegate/event? 
            var userPermissionedItems = this.GetPermissionedItems(userId, items);
            var validItems = this.GetNotDeletedItems(userPermissionedItems);
            
            return validItems;
        }

        private IEnumerable<T> GetPermissionedItems<T>(int? userId, IEnumerable<T> items)
            where T : IItemBound
        {
            var publicItems = this._context.Items
                .Where(i => i.ItemPermissionType == ItemPermissionType.Public);
            
            var userItems = userId.HasValue
                ? this._context.UserItems
                    .Where(ui => ui.UserId == userId)
                    .ToList()
                : new List<UserItem>() { };
            
            return items
                .Where(i => userItems.Any(ui => ui.ItemId == i.ItemId) 
                            || publicItems.Any(pi => pi.ItemId == i.ItemId));
        }

        private IEnumerable<T> GetNotDeletedItems<T>(IEnumerable<T> items)
            where T : IItemBound
        {
            var notDeletedItems = this._context.Items.Where(i => !i.DateDeleted.HasValue);
            return items
                .Where(i => notDeletedItems.Any(ndi => ndi.ItemId == i.ItemId));
        }
    }
}
using System.Collections.Generic;
using System.Linq;
using Web.Models;
using WebApplication;

namespace Web.Services
{
    public class ItemFilterer
    {
        private DatabaseContext _context;

        public ItemFilterer(DatabaseContext context)
        {
            this._context = context;
        }

        public IEnumerable<T> GetValidItems<T>(int userId, IEnumerable<T> items)
        where T : IItemBound
        {
            // TODO: can this be a delegate/event? 
            var userPermissionedItems = this.GetUserPermissionedItems(userId, items);
            var validItems = this.GetNotDeletedItems(userId, userPermissionedItems);
            return validItems;
        }

        private IEnumerable<T> GetUserPermissionedItems<T>(int userId, IEnumerable<T> items)
            where T : IItemBound
        {
            using (var context = this._context)
            {
                var userItems = context.UserItems
                    .Where(ui => ui.UserId == userId)
                    .ToList();
                return items
                    .Where(i => userItems.Any(ui => ui.ItemId == i.ItemId));
            }
        }

        private IEnumerable<T> GetNotDeletedItems<T>(int userId, IEnumerable<T> items)
            where T : IItemBound
        {
            using (var context = this._context)
            {
                var notDeletedItems = context.Items.Where(i => !i.DateDeleted.HasValue);
                return items
                    .Where(i => notDeletedItems.Any(ndi => ndi.ItemId == i.ItemId));
            }
        }
    }
}
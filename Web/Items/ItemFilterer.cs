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

        public IReadOnlyList<Item> GetValidItems<T>(int? userId, IReadOnlyList<T> items)
        { 
            var publicItems = this._context.Items
                .Where(i => i.ItemPermissionTypeId == ItemPermissionType.Public)
                .ToList();

            return publicItems;
        }
    }
}
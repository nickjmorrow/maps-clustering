using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using WebApplication;
using WebApplication.Models;

namespace Warlock.Services
{
    [Authorize]
    public class UserItemService
    {
        private readonly DatabaseContext _context;

        public UserItemService(DatabaseContext context)
        {
            this._context = context;
        }

        public IEnumerable<Item> GetUserItems(int userId)
        {
            using (var context = this._context)
            {
                var userItems = context.UserItems
                    .Where(ui => ui.UserId == userId)
                    .Select(ui => ui.ItemId)
                    .ToList();

                return context.Items
                    .Where(i => userItems.Contains(i.ItemId))
                    .ToList();
            }
        }

        public UserItem AddUserItem(int userId, int itemId)
        {
            var userItem = new UserItem {UserId = userId, ItemId = itemId};
            using (var context = this._context)
            {
                if (context.UserItems.SingleOrDefault(ui => ui == userItem) != null)
                {
                    throw new ArgumentException(
                        $"UserItem with userId {userId} and itemId {itemId} already in database.");
                }

                context.UserItems.Add(userItem);
                context.SaveChanges();
                return userItem;
            }
        }

        public UserItem RemoveUserItem(int userId, int itemId)
        {
            var userItem = new UserItem() {UserId = userId, ItemId = itemId};
            using (var context = this._context)
            {
                var persistedUserItem = context.UserItems.SingleOrDefault(ui => ui == userItem);
                if (persistedUserItem == null)
                {
                    throw new ArgumentException(
                        $"UserItem with userId {userId} and itemId {itemId} is not in database.");
                }

                context.UserItems.Remove(persistedUserItem);
                context.SaveChanges();
                return userItem;
            }
        }
    }
}
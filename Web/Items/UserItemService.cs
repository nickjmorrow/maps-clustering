using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using WebApplication;
using WebApplication.Models;

namespace Warlock.Services
{
    public interface IUserItemService
    {
        IEnumerable<Item> GetUserItems(int userId);
        UserItem AddUserItem(int userId, int itemId);
        UserItem RemoveUserItem(int userId, int itemId);
    }

    [Authorize]
    public class UserItemService : IUserItemService
    {
        private DatabaseContext _context;

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

        public IEnumerable<int> GetUserFavoriteItems(int userId)
        {
            using (var context = this._context)
            {
                return context.UserFavoriteItems
                    .Where(ufi => ufi.UserId == userId)
                    .Select(ufi => ufi.ItemId)
                    .ToList();
            }
        }

        public UserItem AddUserItem(int userId, int itemId)
        {
            var userItem = new UserItem() {UserId = userId, ItemId = itemId};
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

        public async Task<IEnumerable<UserItem>> AddUserItemsAsync(int userId, IEnumerable<int> itemIds)
        {
            using (var context = this._context)
            {
                var userItems = itemIds.Select(itemId => new UserItem()
                {
                    UserId = userId,
                    ItemId = itemId
                });
                await context.UserItems.AddRangeAsync(userItems);
                await context.SaveChangesAsync();
                return userItems;
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

        public int ToggleFavoriteItem(int userId, int itemId)
        {
            var userFavoriteItem = new UserFavoriteItem()
            {
                UserId = userId,
                ItemId = itemId
            };
            using (var context = this._context)
            {
                if (context.UserFavoriteItems.Any(ufi => ufi.UserId == userId && ufi.ItemId == itemId))
                {
                    context.UserFavoriteItems.Remove(userFavoriteItem);
                }
                else
                {
                    context.UserFavoriteItems.Add(userFavoriteItem);
                }

                context.SaveChanges();
            }

            return itemId;
        }
    }
}
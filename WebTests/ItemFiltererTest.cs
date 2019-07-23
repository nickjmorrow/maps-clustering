using System;
using System.Collections.Generic;
using Calc.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using NUnit.Framework;
using Web.Services;
using WebApplication;
using WebApplication.Enums;
using WebApplication.Models;
using ItemType = WebApplication.Enums.ItemType;

namespace WebTests
{
    public class ItemFiltererTest
    {
        private const int UserId = 99;
        private const int SomeOtherUserId = 34;

        [Test]
        public void TestGetValidItems()
        {
            var options = new DbContextOptionsBuilder<DatabaseContext>().UseInMemoryDatabase("TEST_DATABASE", new InMemoryDatabaseRoot()).Options;

            using (var context = new DatabaseContext(options))
                
            {
                var items = new List<Item>
                {
                    new Item
                    {
                        ItemId = 1,
                        ItemTypeId = ItemType.PointsGroup,
                        ItemPermissionTypeId = ItemPermissionType.Public
                    },
                    new Item
                    {
                        ItemId = 2,
                        ItemTypeId = ItemType.PointsGroup,
                        ItemPermissionTypeId = ItemPermissionType.Private,
                    },
                    new Item
                    {
                        ItemId = 3,
                        ItemTypeId = ItemType.PointsGroup,
                        ItemPermissionTypeId = ItemPermissionType.Private
                    },
                    new Item
                    {
                        ItemId = 4,
                        ItemTypeId = ItemType.PointsGroup,
                        ItemPermissionTypeId = ItemPermissionType.Public,
                        DateDeleted = DateTime.Now
                    }
                };

                var userItems = new List<UserItem>
                {
                    new UserItem
                    {
                        ItemId = 1,
                        UserId = UserId
                    },
                    new UserItem
                    {
                        ItemId = 3,
                        UserId = SomeOtherUserId
                    },
                    new UserItem
                    {
                        ItemId = 4,
                        UserId = UserId
                    }
                };
                
                context.AddRange(items);
                context.AddRange(userItems);
                context.SaveChanges();

                var expectedValidItems = new List<Item>
                {
                    new Item
                    {
                        ItemId = 1,
                        ItemTypeId = ItemType.PointsGroup,
                        ItemPermissionTypeId = ItemPermissionType.Public
                    }
                };

                var itemFilterer = new ItemFilterer(context);

                var actualValidItems = itemFilterer.GetValidItems(UserId, items);

                Assert.IsTrue(ListComparer.Compare(actualValidItems, expectedValidItems));
            }
        }
    }
}
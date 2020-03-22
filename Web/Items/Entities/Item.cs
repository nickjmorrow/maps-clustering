using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Models;
using WebApplication.Enums;

namespace WebApplication.Models
{
    [Table("items", Schema="mc")]
    public class Item : IItemBound, IDeletable
    {
        [Key] 
        public int ItemId { get; set; }
        public Enums.ItemType ItemTypeId { get; set; }
        public ItemPermissionType ItemPermissionTypeId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateDeleted { get; set; }

        public override bool Equals(object obj)
        {
            var otherItem = (Item) obj;
            if (otherItem == null)
            {
                return false;
            }
            
            return this.ItemId == otherItem.ItemId
                && this.ItemTypeId == otherItem.ItemTypeId
                && this.ItemPermissionTypeId == otherItem.ItemPermissionTypeId;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}
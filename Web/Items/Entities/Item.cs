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
        [Key, Column("item_id")]
        public int ItemId { get; set; }
        [Column("item_type_id")]
        public Enums.ItemType ItemTypeId { get; set; }
        [Column("item_permission_type_id")]
        public ItemPermissionType ItemPermissionTypeId { get; set; }
        [Column("date_created")]
        public DateTime DateCreated { get; set; }
        [Column("date_deleted")]
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
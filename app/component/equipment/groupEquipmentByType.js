export const groupEquipmentByType = (equipmentArray) => {
    return equipmentArray.reduce((groups, item) => {
      const { type } = item;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
      return groups;
    }, {});
  };
  
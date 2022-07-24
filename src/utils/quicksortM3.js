const sortingCompare = (itemA, itemB) => {
  if (itemA.priority > itemB.priority) return true;
  if (itemA.priority < itemB.priority) return false;
  if (itemA.deadline < itemB.deadline) return true;
  if (itemA.deadline > itemB.deadline) return false;

  return false;
};

const exchange = (list, idxA, idxB) => {
  const tmp = list[idxA];

  list[idxA] = list[idxB];

  list[idxB] = tmp;
};

const partition = (list, left, right) => {
  let j = left;

  for (let k = left; k < right; k += 1) {
    if (sortingCompare(list[k], list[right])) {
      exchange(list, k, j);

      j += 1;
    }
  }

  exchange(list, j, right);

  return j;
};

export const quicksortM3 = (list, left = 0, right = null) => {
  right = right || list.length - 1;

  console.log({ list, left, right });

  const middle = Math.floor((left + right) / 2);

  console.log('middle: ', middle);

  if (right <= left) return;

  const pivoIdx = partition(list, left, right);

  quicksortM3(list, left, pivoIdx - 1);

  quicksortM3(list, pivoIdx + 1, right);
};

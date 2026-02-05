// Visualization Step Definition
export type AlgorithmType = "sorting" | "searching";
export type AlgorithmName =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "linear"
  | "binary";

export interface Step {
  array: number[];
  comparing: number[]; // Indices currently being compared
  swapping: number[]; // Indices currently being swapped
  sorted: number[]; // Indices that are fully sorted/found
  found?: number; // Index found (for searching)
  description?: string;
  range?: [number, number]; // Highlighted range (for binary search/divide & conquer)
}

// Helper to create a delay
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// SORTING ALGORITHMS (Generators)
// ============================================

export function* bubbleSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield {
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: [],
    description:
      "Starting Bubble Sort: adjacent elements will 'bubble up' to their correct position.",
  };

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...a],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `Checking: Is ${a[j]} > ${a[j + 1]}?`,
      };

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield {
          array: [...a],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Yes! Swapping ${a[j + 1]} and ${a[j]}.`,
        };
      }
    }
    sorted.push(n - 1 - i);
    yield {
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `End of pass: ${a[n - 1 - i]} is locked in place.`,
    };
  }
}

export function* selectionSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];

  yield {
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: [],
    description:
      "Starting Selection Sort: finding the minimum element in each pass.",
  };

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...a],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        description: `Current minimum is ${a[minIdx]}. Comparing with ${a[j]}.`,
      };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield {
          array: [...a],
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          description: `New minimum found: ${a[minIdx]}!`,
        };
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield {
        array: [...a],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Swapping ${a[i]} into its correct spot.`,
      };
    }
    sorted.push(i);
    yield {
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `Position ${i} is now finalized.`,
    };
  }
}

export function* insertionSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  const n = a.length;

  yield {
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: [0],
    description:
      "Starting Insertion Sort: picking elements and inserting them into the sorted portion.",
  };

  for (let i = 1; i < n; i++) {
    let key = a[i];
    let j = i - 1;

    yield {
      array: [...a],
      comparing: [i],
      swapping: [],
      sorted: Array.from({ length: i }, (_, k) => k),
      description: `Picking ${key} to insert into the sorted section (indices 0 to ${i - 1}).`,
    };

    while (j >= 0 && a[j] > key) {
      yield {
        array: [...a],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        description: `${a[j]} > ${key}. Shifting ${a[j]} to the right.`,
      };
      a[j + 1] = a[j];
      yield {
        array: [...a],
        comparing: [],
        swapping: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => k),
      };
      j = j - 1;
    }
    a[j + 1] = key;
    yield {
      array: [...a],
      comparing: [],
      swapping: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      description: `Inserted ${key} at position ${j + 1}.`,
    };
  }
}

function* merge(
  arr: number[],
  l: number,
  m: number,
  r: number,
): Generator<Step> {
  const n1 = m - l + 1;
  const n2 = r - m;
  const L = arr.slice(l, m + 1);
  const R = arr.slice(m + 1, r + 1);

  yield {
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    range: [l, r],
    description: `Merging left [${l}-${m}] and right [${m + 1}-${r}] subarrays.`,
  };

  let i = 0,
    j = 0,
    k = l;

  while (i < n1 && j < n2) {
    yield {
      array: [...arr],
      comparing: [l + i, m + 1 + j],
      swapping: [],
      sorted: [],
      range: [l, r],
      description: `Comparing ${L[i]} and ${R[j]}.`,
    };
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    yield {
      array: [...arr],
      comparing: [],
      swapping: [k],
      sorted: [],
      range: [l, r],
      description: `Placing ${arr[k]} back in correct order.`,
    };
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    yield {
      array: [...arr],
      comparing: [],
      swapping: [k],
      sorted: [],
      range: [l, r],
      description: "Appending remaining left elements.",
    };
    i++;
    k++;
  }
  while (j < n2) {
    arr[k] = R[j];
    yield {
      array: [...arr],
      comparing: [],
      swapping: [k],
      sorted: [],
      range: [l, r],
      description: "Appending remaining right elements.",
    };
    j++;
    k++;
  }
}

function* mergeSortRecursive(
  arr: number[],
  l: number,
  r: number,
): Generator<Step> {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  yield {
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    range: [l, r],
    description: `Splitting range [${l}-${r}] at midpoint ${m}.`,
  };
  yield* mergeSortRecursive(arr, l, m);
  yield* mergeSortRecursive(arr, m + 1, r);
  yield* merge(arr, l, m, r);
}

export function* mergeSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  yield* mergeSortRecursive(a, 0, a.length - 1);
  yield {
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: a.map((_, i) => i),
    description: "Merge Sort complete!",
  };
}

function* partition(a: number[], low: number, high: number): Generator<Step> {
  let pivot = a[high];
  let i = low - 1;
  yield {
    array: [...a],
    comparing: [high],
    swapping: [],
    sorted: [],
    range: [low, high],
    description: `Partitioning: Using ${pivot} as the pivot.`,
  };

  for (let j = low; j <= high - 1; j++) {
    yield {
      array: [...a],
      comparing: [j, high],
      swapping: [],
      sorted: [],
      range: [low, high],
      description: `Is ${a[j]} < ${pivot}?`,
    };
    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      yield {
        array: [...a],
        comparing: [],
        swapping: [i, j],
        sorted: [],
        range: [low, high],
        description: "Yes! Moving it to the left side.",
      };
    }
  }
  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  yield {
    array: [...a],
    comparing: [],
    swapping: [i + 1, high],
    sorted: [],
    range: [low, high],
    description: `Placing pivot ${pivot} in its final spot at index ${i + 1}.`,
  };
  return i + 1;
}

function* quickSortRecursive(
  a: number[],
  low: number,
  high: number,
): Generator<Step> {
  if (low < high) {
    const piIterator = partition(a, low, high);
    let res = piIterator.next();
    while (!res.done) {
      yield res.value;
      res = piIterator.next();
    }
    const pi = res.value as number;
    yield* quickSortRecursive(a, low, pi - 1);
    yield* quickSortRecursive(a, pi + 1, high);
  } else if (low === high) {
    yield {
      array: [...a],
      comparing: [],
      swapping: [],
      sorted: [],
      range: [low, high],
      description: "Single element is already sorted.",
    };
  }
}

export function* quickSort(arr: number[]): Generator<Step> {
  const a = [...arr];
  yield* quickSortRecursive(a, 0, a.length - 1);
  yield {
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: a.map((_, i) => i),
    description: "Quick Sort complete!",
  };
}

export function* linearSearch(arr: number[], target: number): Generator<Step> {
  const a = [...arr];
  yield {
    array: a,
    comparing: [],
    swapping: [],
    sorted: [],
    description: `Starting Linear Search for ${target}. We'll check every element one by one.`,
  };
  for (let i = 0; i < a.length; i++) {
    yield {
      array: a,
      comparing: [i],
      swapping: [],
      sorted: [],
      description: `Checking index ${i}: is ${a[i]} == ${target}?`,
    };
    if (a[i] === target) {
      yield {
        array: a,
        comparing: [],
        swapping: [],
        sorted: [],
        found: i,
        description: `Success! Target found at index ${i}.`,
      };
      return;
    }
  }
  yield {
    array: a,
    comparing: [],
    swapping: [],
    sorted: [],
    description: `Target ${target} was not found after checking the entire array.`,
  };
}

export function* binarySearch(arr: number[], target: number): Generator<Step> {
  const a = [...arr].sort((x, y) => x - y);
  yield {
    array: a,
    comparing: [],
    swapping: [],
    sorted: [],
    description: "Binary Search requires a sorted array. Let's sort it first.",
  };
  yield {
    array: a,
    comparing: [],
    swapping: [],
    sorted: a.map((_, i) => i),
    description: "Array is sorted. Starting Binary Search.",
  };
  yield {
    array: a,
    comparing: [],
    swapping: [],
    sorted: [],
    description: `Goal: Find ${target}. We will repeatedly halve the search range.`,
  };

  let left = 0;
  let right = a.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    yield {
      array: a,
      comparing: [mid],
      swapping: [],
      sorted: [],
      range: [left, right],
      description: `Calculating mid index: ${mid}. Checking value ${a[mid]}.`,
    };

    if (a[mid] === target) {
      yield {
        array: a,
        comparing: [],
        swapping: [],
        sorted: [],
        found: mid,
        description: `Target found at the middle! Found ${target} at index ${mid}.`,
      };
      return;
    }

    if (a[mid] < target) {
      yield {
        array: a,
        comparing: [],
        swapping: [],
        sorted: [],
        range: [left, mid],
        description: `${a[mid]} is too small. Discarding everything to the left.`,
      };
      left = mid + 1;
    } else {
      yield {
        array: a,
        comparing: [],
        swapping: [],
        sorted: [],
        range: [mid, right],
        description: `${a[mid]} is too big. Discarding everything to the right.`,
      };
      right = mid - 1;
    }
    if (left <= right) {
      yield {
        array: a,
        comparing: [],
        swapping: [],
        sorted: [],
        range: [left, right],
        description: `Searching within indices [${left} - ${right}].`,
      };
    }
  }
  yield {
    array: a,
    comparing: [],
    swapping: [],
    sorted: [],
    description: `Range exhausted. ${target} is not in the array.`,
  };
}

export const ALGORITHM_INFO: Record<
  AlgorithmName,
  {
    name: string;
    type: AlgorithmType;
    time: string;
    space: string;
    desc: string;
  }
> = {
  bubble: {
    name: "Bubble Sort",
    type: "sorting",
    time: "O(n²)",
    space: "O(1)",
    desc: "Repeatedly compares and swaps adjacent elements.",
  },
  selection: {
    name: "Selection Sort",
    type: "sorting",
    time: "O(n²)",
    space: "O(1)",
    desc: "Repeatedly finds the minimum element and moves it to the beginning.",
  },
  insertion: {
    name: "Insertion Sort",
    type: "sorting",
    time: "O(n²)",
    space: "O(1)",
    desc: "Builds a sorted array one element at a time by shifting larger elements.",
  },
  merge: {
    name: "Merge Sort",
    type: "sorting",
    time: "O(n log n)",
    space: "O(n)",
    desc: "Divide and conquer algorithm that recursively splits and merges halves.",
  },
  quick: {
    name: "Quick Sort",
    type: "sorting",
    time: "O(n log n)",
    space: "O(log n)",
    desc: "Divide and conquer algorithm that partitions the array around a pivot.",
  },
  linear: {
    name: "Linear Search",
    type: "searching",
    time: "O(n)",
    space: "O(1)",
    desc: "Checks every element sequentially until the target is found.",
  },
  binary: {
    name: "Binary Search",
    type: "searching",
    time: "O(log n)",
    space: "O(1)",
    desc: "Efficiently searches a sorted array by repeatedly halving the search range.",
  },
};

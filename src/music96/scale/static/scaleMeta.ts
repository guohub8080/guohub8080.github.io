import collect from "collect.js";

const musicalScale = [
    {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [0, 2, 4, 5, 7, 9, 11]
    },
    {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [0, 2, 3, 5, 7, 9, 10]
    },
    {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [0, 1, 3, 5, 7, 8, 10]
    }, {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [0, 2, 4, 6, 7, 9, 11]
    }, {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [0, 2, 4, 5, 7, 9, 10]
    }, {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [0, 2, 3, 5, 7, 8, 10]
    }, {
        step: "C",
        alter: 0,
        locationID: 0,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [0, 1, 3, 5, 6, 8, 10]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [2, 4, 6, 7, 9, 11, 1]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [2, 4, 5, 7, 9, 11, 0]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [2, 3, 5, 7, 9, 10, 0]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [2, 4, 6, 8, 9, 11, 1]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [2, 4, 6, 7, 9, 11, 0]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [2, 4, 5, 7, 9, 10, 0]
    }, {
        step: "D",
        alter: 0,
        locationID: 2,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [2, 3, 5, 7, 8, 10, 0]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [4, 6, 8, 9, 11, 1, 3]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [4, 6, 7, 9, 11, 1, 2]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [4, 5, 7, 9, 11, 0, 2]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [4, 6, 8, 10, 11, 1, 3]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [4, 6, 8, 9, 11, 1, 2]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [4, 6, 7, 9, 11, 0, 2]
    }, {
        step: "E",
        alter: 0,
        locationID: 4,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [4, 5, 7, 9, 10, 0, 2]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [5, 7, 9, 10, 0, 2, 4]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [5, 7, 8, 10, 0, 2, 3]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [5, 6, 8, 10, 0, 1, 3]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [5, 7, 9, 11, 0, 2, 4]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [5, 7, 9, 10, 0, 2, 3]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [5, 7, 8, 10, 0, 1, 3]
    }, {
        step: "F",
        alter: 0,
        locationID: 5,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [5, 6, 8, 10, 11, 1, 3]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [7, 9, 11, 0, 2, 4, 6]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [7, 9, 10, 0, 2, 4, 5]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [7, 8, 10, 0, 2, 3, 5]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [7, 9, 11, 1, 2, 4, 6]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [7, 9, 11, 0, 2, 4, 5]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [7, 9, 10, 0, 2, 3, 5]
    }, {
        step: "G",
        alter: 0,
        locationID: 7,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [7, 8, 10, 0, 1, 3, 5]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [9, 11, 1, 2, 4, 6, 8]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [9, 11, 0, 2, 4, 6, 7]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [9, 10, 0, 2, 4, 5, 7]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [9, 11, 1, 3, 4, 6, 8]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [9, 11, 1, 2, 4, 6, 7]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [9, 11, 0, 2, 4, 5, 7]
    }, {
        step: "A",
        alter: 0,
        locationID: 9,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [9, 10, 0, 2, 3, 5, 7]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [11, 1, 3, 4, 6, 8, 10]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [11, 1, 2, 4, 6, 8, 9]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [11, 0, 2, 4, 6, 7, 9]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [11, 1, 3, 5, 6, 8, 10]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [11, 1, 3, 4, 6, 8, 9]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [11, 1, 2, 4, 6, 7, 9]
    }, {
        step: "B",
        alter: 0,
        locationID: 11,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [11, 0, 2, 4, 5, 7, 9]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "ION",
        isReplaced: true,
        replacedStep: "D",
        replacedAlter: -1,
        replacedLocationId: 1
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [1, 3, 5, 6, 8, 10, 0]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [1, 3, 4, 6, 8, 10, 11]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [1, 2, 4, 6, 8, 9, 11]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "D",
        replacedAlter: -1,
        replacedLocationId: 1
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [1, 3, 5, 7, 8, 10, 0]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [1, 3, 5, 6, 8, 10, 11]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [1, 3, 4, 6, 8, 9, 11]
    }, {
        step: "C",
        alter: 1,
        locationID: 1,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [1, 2, 4, 6, 7, 9, 11]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "ION",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: 0,
        replacedLocationId: 11
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [11, 1, 3, 4, 6, 8, 10]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: 0,
        replacedLocationId: 11
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [11, 1, 2, 4, 6, 8, 9]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: 0,
        replacedLocationId: 11
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [11, 0, 2, 4, 6, 7, 9]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [11, 1, 3, 5, 6, 8, 10]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: 0,
        replacedLocationId: 11
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [11, 1, 3, 4, 6, 8, 9]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: 0,
        replacedLocationId: 11
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [11, 1, 2, 4, 6, 7, 9]
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: 0,
        replacedLocationId: 11
    }, {
        step: "C",
        alter: -1,
        locationID: 11,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [11, 0, 2, 4, 5, 7, 9]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "ION",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: -1,
        replacedLocationId: 3
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [3, 5, 7, 8, 10, 0, 2]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: -1,
        replacedLocationId: 3
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [3, 5, 6, 8, 10, 0, 1]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [3, 4, 6, 8, 10, 11, 1]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: -1,
        replacedLocationId: 3
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [3, 5, 7, 9, 10, 0, 2]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: -1,
        replacedLocationId: 3
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [3, 5, 7, 8, 10, 0, 1]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [3, 5, 6, 8, 10, 11, 1]
    }, {
        step: "D",
        alter: 1,
        locationID: 3,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [3, 4, 6, 8, 9, 11, 1]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [1, 3, 5, 6, 8, 10, 0]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 1,
        replacedLocationId: 1
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [1, 3, 4, 6, 8, 10, 11]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 1,
        replacedLocationId: 1
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [1, 2, 4, 6, 8, 9, 11]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [1, 3, 5, 7, 8, 10, 0]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [1, 3, 5, 6, 8, 10, 11]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 1,
        replacedLocationId: 1
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [1, 3, 4, 6, 8, 9, 11]
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 1,
        replacedLocationId: 1
    }, {
        step: "D",
        alter: -1,
        locationID: 1,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [1, 2, 4, 6, 7, 9, 11]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "ION",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 0,
        replacedLocationId: 5
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [5, 7, 9, 10, 0, 2, 4]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 0,
        replacedLocationId: 5
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [5, 7, 8, 10, 0, 2, 3]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 0,
        replacedLocationId: 5
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [5, 6, 8, 10, 0, 1, 3]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 0,
        replacedLocationId: 5
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [5, 7, 9, 11, 0, 2, 4]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 0,
        replacedLocationId: 5
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [5, 7, 9, 10, 0, 2, 3]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 0,
        replacedLocationId: 5
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [5, 7, 8, 10, 0, 1, 3]
    }, {
        step: "E",
        alter: 1,
        locationID: 5,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [5, 6, 8, 10, 11, 1, 3]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [3, 5, 7, 8, 10, 0, 2]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [3, 5, 6, 8, 10, 0, 1]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "D",
        replacedAlter: 1,
        replacedLocationId: 3
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [3, 4, 6, 8, 10, 11, 1]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [3, 5, 7, 9, 10, 0, 2]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [3, 5, 7, 8, 10, 0, 1]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [3, 5, 6, 8, 10, 11, 1]
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "D",
        replacedAlter: 1,
        replacedLocationId: 3
    }, {
        step: "E",
        alter: -1,
        locationID: 3,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [3, 4, 6, 8, 9, 11, 1]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [6, 8, 10, 11, 1, 3, 5]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [6, 8, 9, 11, 1, 3, 4]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [6, 7, 9, 11, 1, 2, 4]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "G",
        replacedAlter: -1,
        replacedLocationId: 6
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [6, 8, 10, 0, 1, 3, 5]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [6, 8, 10, 11, 1, 3, 4]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [6, 8, 9, 11, 1, 2, 4]
    }, {
        step: "F",
        alter: 1,
        locationID: 6,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [6, 7, 9, 11, 0, 2, 4]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "ION",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [4, 6, 8, 9, 11, 1, 3]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [4, 6, 7, 9, 11, 1, 2]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [4, 5, 7, 9, 11, 0, 2]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [4, 6, 8, 10, 11, 1, 3]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [4, 6, 8, 9, 11, 1, 2]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [4, 6, 7, 9, 11, 0, 2]
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "E",
        replacedAlter: 0,
        replacedLocationId: 4
    }, {
        step: "F",
        alter: -1,
        locationID: 4,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [4, 5, 7, 9, 10, 0, 2]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "ION",
        isReplaced: true,
        replacedStep: "A",
        replacedAlter: -1,
        replacedLocationId: 8
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [8, 10, 0, 1, 3, 5, 7]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [8, 10, 11, 1, 3, 5, 6]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [8, 9, 11, 1, 3, 4, 6]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "A",
        replacedAlter: -1,
        replacedLocationId: 8
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [8, 10, 0, 2, 3, 5, 7]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "A",
        replacedAlter: -1,
        replacedLocationId: 8
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [8, 10, 0, 1, 3, 5, 6]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [8, 10, 11, 1, 3, 4, 6]
    }, {
        step: "G",
        alter: 1,
        locationID: 8,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [8, 9, 11, 1, 2, 4, 6]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [6, 8, 10, 11, 1, 3, 5]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 1,
        replacedLocationId: 6
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [6, 8, 9, 11, 1, 3, 4]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 1,
        replacedLocationId: 6
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [6, 7, 9, 11, 1, 2, 4]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [6, 8, 10, 0, 1, 3, 5]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 1,
        replacedLocationId: 6
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [6, 8, 10, 11, 1, 3, 4]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 1,
        replacedLocationId: 6
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [6, 8, 9, 11, 1, 2, 4]
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "F",
        replacedAlter: 1,
        replacedLocationId: 6
    }, {
        step: "G",
        alter: -1,
        locationID: 6,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [6, 7, 9, 11, 0, 2, 4]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "ION",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: -1,
        replacedLocationId: 10
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [10, 0, 2, 3, 5, 7, 9]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: -1,
        replacedLocationId: 10
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [10, 0, 1, 3, 5, 7, 8]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [10, 11, 1, 3, 5, 6, 8]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: -1,
        replacedLocationId: 10
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [10, 0, 2, 4, 5, 7, 9]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: -1,
        replacedLocationId: 10
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [10, 0, 2, 3, 5, 7, 8]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "B",
        replacedAlter: -1,
        replacedLocationId: 10
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [10, 0, 1, 3, 5, 6, 8]
    }, {
        step: "A",
        alter: 1,
        locationID: 10,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [10, 11, 1, 3, 4, 6, 8]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [8, 10, 0, 1, 3, 5, 7]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [8, 10, 11, 1, 3, 5, 6]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "G",
        replacedAlter: 1,
        replacedLocationId: 8
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [8, 9, 11, 1, 3, 4, 6]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [8, 10, 0, 2, 3, 5, 7]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [8, 10, 0, 1, 3, 5, 6]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "G",
        replacedAlter: 1,
        replacedLocationId: 8
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [8, 10, 11, 1, 3, 4, 6]
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "G",
        replacedAlter: 1,
        replacedLocationId: 8
    }, {
        step: "A",
        alter: -1,
        locationID: 8,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [8, 9, 11, 1, 2, 4, 6]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "ION",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [0, 2, 4, 5, 7, 9, 11]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "DOR",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [0, 2, 3, 5, 7, 9, 10]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "PHR",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [0, 1, 3, 5, 7, 8, 10]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "LYD",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [0, 2, 4, 6, 7, 9, 11]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "MLY",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [0, 2, 4, 5, 7, 9, 10]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "AEO",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [0, 2, 3, 5, 7, 8, 10]
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "C",
        replacedAlter: 0,
        replacedLocationId: 0
    }, {
        step: "B",
        alter: 1,
        locationID: 0,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [0, 1, 3, 5, 6, 8, 10]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "ION",
        isReplaced: false,
        locationIdArray: [10, 0, 2, 3, 5, 7, 9]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "DOR",
        isReplaced: false,
        locationIdArray: [10, 0, 1, 3, 5, 7, 8]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "PHR",
        isReplaced: false,
        locationIdArray: [10, 11, 1, 3, 5, 6, 8]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "LYD",
        isReplaced: false,
        locationIdArray: [10, 0, 2, 4, 5, 7, 9]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "MLY",
        isReplaced: false,
        locationIdArray: [10, 0, 2, 3, 5, 7, 8]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "AEO",
        isReplaced: false,
        locationIdArray: [10, 0, 1, 3, 5, 6, 8]
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "LOC",
        isReplaced: true,
        replacedStep: "A",
        replacedAlter: 1,
        replacedLocationId: 10
    }, {
        step: "B",
        alter: -1,
        locationID: 10,
        mode: "LOC",
        isReplaced: false,
        locationIdArray: [10, 11, 1, 3, 4, 6, 8]
    }]
export default {
    musicalScale: collect(musicalScale)
}
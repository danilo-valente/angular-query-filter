'use strict';

describe('queryFilter', function () {

    var sampleObject = [
        {
            id: 1,
            name: 'Danilo',
            age: 18,
            country: 'Brazil',
            locale: 'pt',
            single: true,
            employed: true,
            friends: [3, 5, 6]
        },
        {
            id: 2,
            name: 'Alessa',
            age: 26,
            country: 'Russia',
            language: 'ru',
            single: false,
            employed: true
        },
        {
            id: 3,
            name: 'John',
            age: 20,
            country: 'England',
            language: 'en',
            single: true,
            employed: false
        },
        {
            id: 4,
            name: 'Marcela',
            age: 13,
            country: 'Brazil',
            language: 'pt',
            single: true,
            employed: false,
            friends: [5]
        },
        {
            id: 5,
            name: 'Kevin',
            age: 15,
            country: 'United States',
            language: 'en',
            single: true,
            employed: false,
            friends: [4, 1]
        },
        {
            id: 6,
            name: 'Pablo',
            age: 21,
            country: 'Spain',
            language: 'es',
            single: false,
            employed: false
        },
        {
            id: 7,
            name: 'Juan',
            age: 25,
            country: 'Mexico',
            language: 'es',
            single: false,
            employed: true
        }
    ];

    beforeEach(module('danilovalente.queryFilter'));

    var queryFilter;
    beforeEach(inject(function ($filter) {
        queryFilter = $filter('query');
    }));

    it('should be able to parse nested attributes', function () {

        var query = '$friends.$length = 3';
        var results = queryFilter(sampleObject, query);

        expect(results.length).toEqual(1);
        expect(results[0].id).toEqual(1);
    });

    it('should parse expression with ">=" correctly', function() {

        var query = '$age >= 18';
        var results = queryFilter(sampleObject, query);

        expect(results.length).toEqual(5);

        expect(results[0].id).toEqual(1);
        expect(results[1].id).toEqual(2);
        expect(results[2].id).toEqual(3);
        expect(results[3].id).toEqual(6);
        expect(results[4].id).toEqual(7);

    });

    // TODO: Add more test cases

});
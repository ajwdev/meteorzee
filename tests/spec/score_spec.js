describe('validate_die', function() {
  it('should reject a die that is not a number', function() {
    // Reject dice that are not numbers
    expect(validate_die(null)).toBe(false);
    expect(validate_die(undefined)).toBe(false);
    expect(validate_die("1")).toBe(false);
    expect(validate_die({foo: "something"})).toBe(false);

    expect(validate_die(1)).toBe(true);
  });

  it('should reject a die that is out of range', function() {
    // Reject die that are out of range
    expect(validate_die(7)).toBe(false);
    expect(validate_die(0)).toBe(false);
    expect(validate_die(-1)).toBe(false);

    // Make sure 1-6 are good
    _.each([1,2,3,4,5,6], function(v) {
      expect(validate_die(v)).toBe(true);
    });
  });
});

describe('validate_dice', function() {
  it('should reject dice not equal to five', function() {
    // Reject dice not equal to five
    expect(validate_dice([1,2])).toBe(false);
    expect(validate_dice([1,2,3,4,5,6])).toBe(false);
    
    // Test one that should work fine
    expect(validate_dice([1,2,3,4,5])).toBe(true);
  });

  it("should return undefined with invalid hand", function() {
    expect(validate_dice([0,0,-1,1,2])).toBe(false); 
    expect(validate_dice([null], 1)).toBe(false); 
  });
});

describe("upper_section", function() {
  it("should return the sum of dice equal to the specified face", function() {
    hands = {};
    hands[1] = [1,1,1,3,4];
    hands[2] = [2,2,2,3,4];
    hands[3] = [3,3,3,2,1];
    hands[4] = [4,4,4,1,6];
    hands[5] = [5,5,5,1,4];
    hands[6] = [6,6,6,1,5];;
    _.each([1,2,3,4,5,6], function(v) {
      expect(upper_section(hands[v], v)).toBe(v * 3);
    });
  });

  it("should return undefined with invalid hand", function() {
    expect(upper_section([null], 1)).toBeUndefined(); 
  });

  it("should return undefined with invalid face", function() {
    expect(upper_section([1,1,1,3,4], 0)).toBeUndefined(); 
    expect(upper_section([1,1,1,3,4], null)).toBeUndefined(); 
  });
});  


describe("x_of_a_kind", function() {
  it("should find X number of matches in a hand", function() {
    // No matches
    expect(x_of_a_kind([1,2,3,4,5], 2)).toBe(false);
    
    // Exact matches
    expect(x_of_a_kind([1,2,3,3,4], 2)).toBe(true);

    // More matches than required
    expect(x_of_a_kind([1,3,3,3,3], 2)).toBe(true);
  });

  it("should return undefined with invalid hand", function() {
    expect(x_of_a_kind([null])).toBeUndefined(); 
  });
});  

describe("three_of_a_kind", function() {
  it("should find three of a kind", function() {
    expect(three_of_a_kind([1,1,1,3,4])).toBeGreaterThan(0); 
  });

  it("should return a score of zero when not matched", function() {
    expect(three_of_a_kind([1,1,2,2,4])).toBe(0);
  });

  it("should return a score of the sum of the hand", function() {
    expect(three_of_a_kind([1,1,1,2,4])).toBe(9);
    // Ensure a four of a kind and yahtzee still count
    expect(three_of_a_kind([1,1,1,1,5])).toBe(9);
    expect(three_of_a_kind([1,1,1,1,1])).toBe(5);
  });

  it("should return undefined with invalid hand", function() {
    expect(three_of_a_kind([null])).toBeUndefined(); 
  });
});  

describe("four_of_a_kind", function() {
  it("should find four of a kind", function() {
    expect(four_of_a_kind([1,1,1,1,4])).toBeGreaterThan(0); 
  });

  it("should return a score of zero when not matched", function() {
    expect(four_of_a_kind([1,1,2,2,4])).toBe(0);
  });

  it("should return a score of the sum of the hand", function() {
    expect(four_of_a_kind([1,1,1,1,5])).toBe(9);
    // Ensure a yahtzee still count
    expect(four_of_a_kind([1,1,1,1,1])).toBe(5);
  });

  it("should return undefined with invalid hand", function() {
    expect(four_of_a_kind([null])).toBeUndefined(); 
  });
});  

describe("full_house", function() {
  it("should find a full house", function() {
    _.each(permutations[SCORE_SECTIONS.full_house], function(hand) {
      expect(full_house(hand)).toBeGreaterThan(0);
    });
  });

  it("should return a score of zero when not matched", function() {
    expect(full_house([1,2,3,4,5])).toBe(0);
  });

  it("should return a score of 25", function() {
    expect(full_house([1,1,2,2,2])).toBe(25);
  });

  it("should return undefined with invalid hand", function() {
    expect(full_house([null])).toBeUndefined(); 
  });
});  

describe("small straight", function() {
  it("should find a small straight", function() {
    _.each(permutations[SCORE_SECTIONS.small_straight], function(hand) {
      expect(small_straight(hand)).toBeGreaterThan(0);
    });
  });

  it("should return a score of zero when not matched", function() {
    expect(small_straight([1,1,2,2,2])).toBe(0);
  });

  it("should return a score of 30", function() {
    expect(small_straight([1,2,3,4,6])).toBe(30);
    // Ensure a large straight still counts
    expect(small_straight([1,2,3,4,5])).toBe(30);
  });

  it("should return undefined with invalid hand", function() {
    expect(small_straight([null])).toBeUndefined(); 
  });
});  

describe("large straight", function() {
  it("should find a large straight", function() {
    _.each(permutations[SCORE_SECTIONS.large_straight], function(hand) {
      expect(large_straight(hand)).toBeGreaterThan(0);
    });
  });

  it("should return a score of zero when not matched", function() {
    expect(large_straight([1,2,2,4,5])).toBe(0);
    expect(large_straight([1,2,3,4,6])).toBe(0);
  });

  it("should return a score of 40", function() {
    expect(large_straight([1,2,3,4,5])).toBe(40);
  });

  it("should return undefined with invalid hand", function() {
    expect(large_straight([null])).toBeUndefined(); 
  });
});  

describe("yahtzee", function() {
  it("should find a yahtzee", function() {
    _.each([1,2,3,4,5,6], function(v) {
      expect(yahtzee([v,v,v,v,v])).toBeGreaterThan(0);
    });
  });

  it("should return a score of zero when not matched", function() {
    expect(yahtzee([1,1,2,4,5])).toBe(0);
  });

  it("should return a score of 50", function() {
    expect(yahtzee([5,5,5,5,5])).toBe(50);
  });

  it("should return undefined with invalid hand", function() {
    expect(yahtzee([null])).toBeUndefined(); 
  });
});  

describe("change", function() {
  it("should correctly score a chance", function() {
    expect(chance([1,3,3,2,6])).toBe(15);
  });

  it("should return undefined with invalid hand", function() {
    expect(chance([null])).toBeUndefined(); 
  });
});  

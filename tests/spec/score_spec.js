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

describe("is_upper_section", function() {
  it("should return true if score section is in the upper section", function() {
    expect(is_upper_section(SCORE_SECTIONS.ones)).toBe(true);
    expect(is_upper_section(SCORE_SECTIONS.twos)).toBe(true);
    expect(is_upper_section(SCORE_SECTIONS.threes)).toBe(true);
    expect(is_upper_section(SCORE_SECTIONS.fours)).toBe(true);
    expect(is_upper_section(SCORE_SECTIONS.fives)).toBe(true);
    expect(is_upper_section(SCORE_SECTIONS.sixes)).toBe(true);
  });

  it("should return false if score section is in the lower section", function() {
    expect(is_upper_section(SCORE_SECTIONS.three_of_a_kind)).toBe(false);
    expect(is_upper_section(SCORE_SECTIONS.four_of_a_kind)).toBe(false);
    expect(is_upper_section(SCORE_SECTIONS.full_house)).toBe(false);
    expect(is_upper_section(SCORE_SECTIONS.small_straight)).toBe(false);
    expect(is_upper_section(SCORE_SECTIONS.large_straight)).toBe(false);
    expect(is_upper_section(SCORE_SECTIONS.yahtzee)).toBe(false);
    expect(is_upper_section(SCORE_SECTIONS.chance)).toBe(false);
  });
});

describe("is_lower_section", function() {
  it("should return true if score section is in the lower section", function() {
    expect(is_lower_section(SCORE_SECTIONS.ones)).toBe(false);
    expect(is_lower_section(SCORE_SECTIONS.twos)).toBe(false);
    expect(is_lower_section(SCORE_SECTIONS.threes)).toBe(false);
    expect(is_lower_section(SCORE_SECTIONS.fours)).toBe(false);
    expect(is_lower_section(SCORE_SECTIONS.fives)).toBe(false);
    expect(is_lower_section(SCORE_SECTIONS.sixes)).toBe(false);
  });

  it("should return false if score section is in the upper section", function() {
    expect(is_lower_section(SCORE_SECTIONS.three_of_a_kind)).toBe(true);
    expect(is_lower_section(SCORE_SECTIONS.four_of_a_kind)).toBe(true);
    expect(is_lower_section(SCORE_SECTIONS.full_house)).toBe(true);
    expect(is_lower_section(SCORE_SECTIONS.small_straight)).toBe(true);
    expect(is_lower_section(SCORE_SECTIONS.large_straight)).toBe(true);
    expect(is_lower_section(SCORE_SECTIONS.yahtzee)).toBe(true);
    expect(is_lower_section(SCORE_SECTIONS.chance)).toBe(true);
  });
});

describe("score_hand", function() {
  // Ensure case statement calls the right function
  _.each(SCORE_SECTIONS, function(v,k) {
    it("should correctly match '" + k.toString() + "' scoring function", function() {
      spyOn(window, k.toString());
      score_hand(v,[1,2,3,4,5]);

      expect(window[k.toString()]).toHaveBeenCalled();
    });
  });
});

describe("Dice validation", function() {
  var dice, bad_dice;
  beforeEach(function() {
    spyOn(window, 'validate_dice');
    ok_dice = [1,2,3,4,5];
    bad_dice = [null,null,null,null,null];
  });

  _.each(SCORE_SECTIONS, function(v,k) {
    describe(k.toString() + " validation", function() {
      it("should always validate the hand", function() {
        var result = window[k.toString()](ok_dice);
        expect(window.validate_dice).toHaveBeenCalledWith(ok_dice);
        // XXX TODO  I'm not sure why the following is failing but
        // it shouldnt and we should fix that and then removed the
        // similiar tests from each describe below
        //expect(result).not.toBeUndefined();
      });

      it("should return undefined when an illegal hand is given", function() {
        var result = window[k.toString()](bad_dice);
        expect(result).toBeUndefined();
      });
    });
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

describe("upper section shortcut methods", function() {
  var dice;
  beforeEach(function() {
    dice = [1,2,3,4,5];
    spyOn(window, 'upper_section');
  });

  describe("ones", function() {
    it("should call 'upper_section' with dice face of 1", function() {
      ones(dice);
      expect(window.upper_section).toHaveBeenCalledWith(dice, 1);
    });
  });

  describe("twos", function() {
    it("should call 'upper_section' with dice face of 2", function() {
      twos(dice);
      expect(window.upper_section).toHaveBeenCalledWith(dice, 2);
    });
  });

  describe("threes", function() {
    it("should call 'upper_section' with dice face of 3", function() {
      threes(dice);
      expect(window.upper_section).toHaveBeenCalledWith(dice, 3);
    });
  });

  describe("fours", function() {
    it("should call 'upper_section' with dice face of 4", function() {
      fours(dice);
      expect(window.upper_section).toHaveBeenCalledWith(dice, 4);
    });
  });

  describe("fives", function() {
    it("should call 'upper_section' with dice face of 5", function() {
      fives(dice);
      expect(window.upper_section).toHaveBeenCalledWith(dice, 5);
    });
  });

  describe("sixes", function() {
    it("should call 'upper_section' with dice face of 6", function() {
      sixes(dice);
      expect(window.upper_section).toHaveBeenCalledWith(dice, 6);
    });
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
  it("should call 'x_of_a_kind' with matches as 3", function() {
    spyOn(window, 'x_of_a_kind');
    var dice = [1,1,1,3,4];
    three_of_a_kind(dice);

    expect(window.x_of_a_kind).toHaveBeenCalledWith(dice, 3);
  });

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
  it("should call 'x_of_a_kind' with matches as 4", function() {
    spyOn(window, 'x_of_a_kind');
    var dice = [1,1,1,1,4];
    four_of_a_kind(dice);

    expect(window.x_of_a_kind).toHaveBeenCalledWith(dice, 4);
  });

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

describe("chance", function() {
  it("should correctly score a chance", function() {
    expect(chance([1,3,3,2,6])).toBe(15);
  });

  it("should return undefined with invalid hand", function() {
    expect(chance([null])).toBeUndefined();
  });
});

// Validate an individual die
validate_die = function(die) {
  // If it's not a number we automagically fail
  if (!_.isNumber(die))
    return false;

  // Value should be 1-6
  return (die > 0 && die < 7);
};

// Validate the entire "hand" of dice
validate_dice = function(dice) {
  // First check length
  if (dice.length !== 5)
    return false;

  // Now check to ensure the numbers are within the bounds of a die
  return _.every(dice, function(v) {
    // The `every` method will as soon as it gets a true back. Since
    // we want to detect a failure in validation, not the validation
    return validate_die(v);
  });
};

group_dice_by_number = function(dice) {
  // Groups the dice together in stacks
  return _.groupBy(dice, function(v) { return v; });
};

is_upper_section = function(section) {
  return section <= SCORE_SECTIONS.sixes ? true : false;
}

is_lower_section = function(section) {
  return section > SCORE_SECTIONS.sixes ? true : false;
}

// *******************************
// Upper Section 
// *******************************

upper_section = function(dice, face) {
  if (!validate_dice(dice))
    return undefined;

  // We need to also validate the die face we want
  if (!validate_die(face))
    return undefined;

  score = _.reduce(dice, function(memo, num) {
    if (num === face) {
      return memo + num;
    } else {
      return memo;
    }
  }, 0);

  return score;
};


// *******************************
// Lower Section
// *******************************

x_of_a_kind = function(dice, matches) {
  if (!validate_dice(dice))
    return undefined;

  var grouped = group_dice_by_number(dice);
  return _.some(grouped, function(group) {
    return group.length >= matches;
  });
};


three_of_a_kind = function(dice) {
  var score = 0;
  result = x_of_a_kind(dice, 3);
  if (_.isUndefined(result)) {
    return undefined;
  } else if (result) {
    score = _.reduce(dice, function(memo, num) { return memo + num; }, 0);
  }

  return score;
};

four_of_a_kind = function(dice) {
  var score = 0;
  result = x_of_a_kind(dice, 4);
  if (_.isUndefined(result)) {
    return undefined;
  } else if (result) {
    score = _.reduce(dice, function(memo, num) { return memo + num; }, 0);
  }
  
  return score;
};

full_house = function(dice) { 
  if (!validate_dice(dice))
    return undefined;

  var grouped = group_dice_by_number(dice);
  var score = 0;
  if (_.size(grouped) === 2) {
    // Its only possible to have 2 groups, 
    // 3 in one, 2 in the other. Thus lets just
    // check to see if either of the groups are
    // of length of three
    if (_.some(grouped, function(v) { return _.size(v) === 3; }))
      score = 25;
  }

  return score;
};

small_straight = function(dice) { 
  if (!validate_dice(dice))
    return undefined;

  var grouped = group_dice_by_number(dice);
  // First see let see if we have 3 and 4 because all small
  // straights need those two numbers
  var score = 0;
  if (_.has(grouped, 3) && _.has(grouped, 4)) {
    if ( (_.has(grouped, 1) && _.has(grouped, 2)) ||
         (_.has(grouped, 2) && _.has(grouped, 5)) ||
         (_.has(grouped, 5) && _.has(grouped, 6)) ) {
      score = 30;
    }
  }

  return score;
};

large_straight = function(dice) { 
  if (!validate_dice(dice))
    return undefined;

  var grouped = group_dice_by_number(dice);
  var score = 0;
  if (_.size(grouped) === 5) {
    // Since we have five individual numbers we have a
    // chance of hitting a large straight. However, we cant
    // have a large straight with both a 1 and a 6. If we
    // have one of them, we're good
    if (_.has(grouped, 1) ^ _.has(grouped, 6))
      score = 40;
  }

  return score;
};

yahtzee = function(dice) {
  if (!validate_dice(dice))
    return undefined;

  var grouped = group_dice_by_number(dice);
  var score = 0;
  if (_.size(grouped) === 1)
    score = 50;

  return score;
};

chance = function(dice) {
  if (!validate_dice(dice))
    return undefined;

  return _.reduce(dice, function(memo, num) { return memo + num; }, 0);
};

# Theoretical Starforce
The theoretical counterpart to Brendon May's experimental starforce calculator

Brendon May's current starforce calculator relies on running thousands of trials
to generate a distribution of meso costs and booms. As a result, the calculator
is quite slow and has some error in its averages. This calculator calculates the
theoretical average meso cost and booms, which eliminates the need for thousands
of trials. It does not, however, produce percentiles, since those would require
either a known mathematical distribution (like cubes or flames) or trials to be
run.

I did shamelessly copy a bunch of Brendon May's HTML code to get the basic UI
working, but the JavaScript is 100% original.

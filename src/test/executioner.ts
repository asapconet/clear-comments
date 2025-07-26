import { get } from "node-emoji";
import { tests } from ".";
import { removeComments, convertLegacyOptions } from "../core/commentRemover";

function executeTests(): void {
  console.log(get("test_tube"), " Running TypeScript tests...\n");

  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    try {
      const removeTypes = convertLegacyOptions(test.preserveJSDoc ?? true);

      const result = removeComments(
        test.input,
        test.extension,
        removeTypes,
        test.customPatterns || []
      );

      const success = result.trim() === test.expected.trim();

      if (success) {
        console.log(
          get("white_check_mark"),
          ` Situation ${index + 1}: ${test.name} - PASSED`
        );
        passed++;
      } else {
        console.log(get("x"), ` Situation ${index + 1}: ${test.name} - FAILED`);
        console.log("   Expected:");
        console.log("   " + JSON.stringify(test.expected.trim()));
        console.log("   Got:");
        console.log("   " + JSON.stringify(result.trim()));
        console.log("");
        failed++;
      }
    } catch (error) {
      console.log(get("boom"), ` Test ${index + 1}: ${test.name} - ERROR`);
      console.log(
        "   ",
        error instanceof Error ? error.message : String(error)
      );
      failed++;
    }
  });

  console.log(`\n${get("bar_chart")} Test Results:`);
  console.log(`   ${get("white_check_mark")} Passed: ${passed}`);
  console.log(`   ${get("x")} Failed: ${failed}`);
  console.log(
    `   ${get("chart_with_upwards_trend")} Success Rate: ${(
      (passed / (passed + failed)) *
      100
    ).toFixed(1)}%`
  );

  if (failed > 0) {
    console.log(get("rotating_light"), "  Some tests failed!");
    process.exit(1);
  } else {
    console.log(get("tada"), "   All tests passed!");
  }
}

executeTests();

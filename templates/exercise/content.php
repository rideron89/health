        <div class="grid_6">
            <div><a href=".">Home</a> > Exercise</div>

            <div id="total_calories">
                <h3>70000</h3> <sub>calories logged</sub>
            </div>

            <table id="exercise_table" class="quota_summary_table">
                <tr class="monthly_quota">
                    <td class="label">Your Monthly Caloric Quota</td>
                    <td></td>
                    <td class="calories"></td>
                    <td class="calories_label">calories</td>
                </tr>
                <tr class="monthly_total">
                    <td class="label">Calories Burned in January</td>
                    <td class="sign">-</td>
                    <td class="calories"></td>
                    <td class="calories_label">calories</td>
                </tr>
                <tr class="calories_togo">
                    <td class="label">Calories Left Until Quota</td>
                    <td></td>
                    <td class="calories"></td>
                    <td class="calories_label">calories</td>
                </tr>
            </table>

            <div id="exercise_entry_form" class="entry_form">
                <label>Add Exercise Entry</label>
                <input class="calories" type="number" placeholder="calories" />
                <input class="comment" type="text" placeholder="comment (optional)" />
                <input class="submit" type="button" value="Add!" />
                <div class="info_message"></div>
            </div>

            <label>Last 25 Entries</label>
            <label>
                Here is a list of your last 25 exercise entries. From this page you may hover over
                any entry and delete if you wish.
            </label>
            <div id="exercise_entry_list">
            </div>
        </div>

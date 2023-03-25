import {GenericFunction} from './../genericFunction';
import {DataSource} from 'typeorm';
import {InjectDataSource} from '@nestjs/typeorm';
import { checkName, insertSchema } from 'src/specifications/queries/queries';
import { masterSchema } from 'src/utils/spec-data';

export class DimensionService {
    constructor(@InjectDataSource() private dataSource: DataSource, private specService: GenericFunction) {
    }

    async createDimension(dimensionDTO) {
        let newObj = this.specService.convertKeysToLowerCase(dimensionDTO);
        const isValidSchema: any = await this.specService.ajvValidator(masterSchema, newObj);
        if (isValidSchema?.errors) {
            return {"code": 400, error: isValidSchema.errors}
        } else {
                let queryResult: any = checkName('program', "DimensionGrammar");
                queryResult = queryResult.replace('$1', `${dimensionDTO?.program.toLowerCase()}`);
                const resultDname = await this.dataSource.query(queryResult);
                if (resultDname?.length > 0) {
                    return {"code": 400, "error": "Dimension name already exists"};
                }
                else {
                    const queryRunner = this.dataSource.createQueryRunner();
                        try {
                            await queryRunner.connect();
                            await queryRunner.startTransaction();
                            let insertQuery = insertSchema(['program', 'schema', '"eventType"', 'name', '"updatedAt"'], 'DimensionGrammar');
                            insertQuery = insertQuery.replace('$1', `'${dimensionDTO.program.toLowerCase()}'`);
                            insertQuery = insertQuery.replace('$2', `'${JSON.stringify(newObj)}'`);
                            insertQuery = insertQuery.replace('$3', `'EXTERNAL'`);
                            insertQuery = insertQuery.replace('$4', `'${dimensionDTO.program.toLowerCase()}'`);
                            insertQuery = insertQuery.replace('$5', 'CURRENT_TIMESTAMP');
                            const insertResult = await queryRunner.query(insertQuery);
                            if (insertResult[0].pid) {
                                    await queryRunner.commitTransaction();
                                    return {
                                        "code": 200,
                                        "message": "Dimension spec created successfully",
                                        "program": dimensionDTO.dimension_name,
                                    };
                                
                            } else {
                                await queryRunner.rollbackTransaction();
                                return {"code": 400, "error": "Unable to insert into spec table"};
                            }
                        } catch (error) {
                            await queryRunner.rollbackTransaction();
                            return {"code": 400, "error": "Something went wrong"}
                        }
                        finally {
                            await queryRunner.release();
                        }
                   
                }
        }
    }

    
}